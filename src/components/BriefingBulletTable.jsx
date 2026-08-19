import { parseBulletRows } from '../constants/briefing';

// "라벨이 공백 없는 한 단어 + 이 값보다 길면" 119px 제한을 풀고 현재처럼 줄바꿈 없이 보여줌
const LONG_WORD_THRESHOLD = 8;

function isLongSingleWord(label) {
  return Boolean(label) && !/\s/.test(label) && label.length > LONG_WORD_THRESHOLD;
}

// 라벨에 괄호가 있으면 괄호 앞에서 줄바꿈함 (예: "일부결제금액이월약정(리볼빙)" → "일부결제금액이월약정" 줄바꿈 "(리볼빙)")
function renderLabel(label) {
  const parenIndex = label.indexOf('(');
  if (parenIndex === -1) return label;

  const before = label.slice(0, parenIndex).trim();
  const paren = label.slice(parenIndex).trim();
  return (
    <>
      {before}
      <br />
      {paren}
    </>
  );
}

// 라벨(대괄호 안 내용)에 " - "가 있으면 그 앞뒤로 나눔
// (예: 라벨 "50% - 고정비 및 저축/투자" → ["50%", "고정비 및 저축/투자"])
function splitDash(text) {
  const idx = text.indexOf(' - ');
  if (idx === -1) return null;
  return [text.slice(0, idx).trim(), text.slice(idx + 3).trim()];
}

// content의 "• [라벨]: 설명" 불릿 본문을 표로 그림, thead 없이 tbody만 구성함
// - 라벨이 하나라도 있으면 라벨 있는 줄만 표로 그리고, 라벨 없는 줄은 표 밖으로 빼서 일반 텍스트로 보여줌
// - 라벨이 하나도 없으면(전체가 라벨 없는 불릿) 표 전체를 1열로 그림
// - 라벨에 " - "가 있으면 그 줄만 라벨을 2칸(라벨 | 중간 설명)으로 더 나눠서 표가 3열이 됨
//   (라벨에 " - "가 없는 다른 줄은 설명 칸을 colSpan으로 맞춤)
function BriefingBulletTable({ body }) {
  const rows = parseBulletRows(body);
  if (rows.length === 0) return null;

  const labeledRows = rows.filter((row) => row.label);
  const plainRows = rows.filter((row) => !row.label);
  const hasLabel = labeledRows.length > 0;
  const tableRows = hasLabel ? labeledRows : rows;
  const strayRows = hasLabel ? plainRows : [];
  const hasDashSplit = tableRows.some((row) => splitDash(row.label));

  return (
    <>
      <div className="briefing-detail-table briefing-detail-table--bullets">
        <table>
          <tbody>
            {tableRows.map((row, index) => {
              const dashParts = splitDash(row.label);
              const labelText = dashParts ? dashParts[0] : row.label;

              return (
                <tr key={`${index}-${row.label}`}>
                  {hasLabel && (
                    <th
                      scope="row"
                      className={`briefing-detail-table-label${
                        isLongSingleWord(labelText) ? ' briefing-detail-table-label--wide' : ''
                      }`}
                    >
                      {renderLabel(labelText)}
                    </th>
                  )}
                  {dashParts && <td>{dashParts[1]}</td>}
                  <td colSpan={hasDashSplit && !dashParts ? 2 : undefined}>{row.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {strayRows.map((row, index) => (
        <p key={`${index}-${row.text}`} className="briefing-detail-section-desc">
          {row.text}
        </p>
      ))}
    </>
  );
}

export default BriefingBulletTable;
