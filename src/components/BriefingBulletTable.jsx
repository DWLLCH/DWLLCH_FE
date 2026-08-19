import { parseBulletRows } from '../constants/briefing';

// "라벨(글자수가 이 값보다 많이) + 공백 없는 한 단어"면 119px 제한을 풀고 현재처럼 줄바꿈 없이 보여줌
const LONG_WORD_THRESHOLD = 8;

function isLongSingleWord(label) {
  return Boolean(label) && !/\s/.test(label) && label.length > LONG_WORD_THRESHOLD;
}

// 라벨에 괄호가 있으면 괄호 앞에서 줄바꿈함 (예: "일부결제금액이월약정(리볼빙)" → 두 줄)
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

// 설명(text)에 " - "가 있으면 그 앞뒤로 나눠서 표를 3열(라벨 | 앞부분 | 뒷부분)로 만들기 위한 헬퍼
function splitDash(text) {
  const idx = text.indexOf(' - ');
  if (idx === -1) return null;
  return [text.slice(0, idx).trim(), text.slice(idx + 3).trim()];
}

// content의 "• [라벨]: 설명" 불릿 본문을 표로 그림, thead 없이 tbody만 구성함
// - 라벨이 하나라도 있으면 라벨 있는 줄만 표로 그리고, 라벨 없는 줄은 표 밖으로 빼서 일반 텍스트로 보여줌
// - 라벨이 하나도 없으면(전체가 라벨 없는 불릿) 표 전체를 1열로 그림
// - 설명에 " - "가 있으면 그 줄만 2칸으로 더 나눠서 표가 3열이 됨(라벨 없는 줄은 colSpan으로 맞춤)
function BriefingBulletTable({ body }) {
  const rows = parseBulletRows(body);
  if (rows.length === 0) return null;

  const labeledRows = rows.filter((row) => row.label);
  const plainRows = rows.filter((row) => !row.label);
  const hasLabel = labeledRows.length > 0;
  const tableRows = hasLabel ? labeledRows : rows;
  const strayRows = hasLabel ? plainRows : [];
  const hasDashSplit = tableRows.some((row) => splitDash(row.text));

  return (
    <>
      <div className="briefing-detail-table briefing-detail-table--bullets">
        <table>
          <tbody>
            {tableRows.map((row, index) => {
              const dashParts = hasDashSplit ? splitDash(row.text) : null;
              return (
                <tr key={`${index}-${row.label}`}>
                  {hasLabel && (
                    <td
                      className={`briefing-detail-table-label${
                        isLongSingleWord(row.label) ? ' briefing-detail-table-label--wide' : ''
                      }`}
                    >
                      {renderLabel(row.label)}
                    </td>
                  )}
                  {dashParts ? (
                    <>
                      <td>{dashParts[0]}</td>
                      <td>{dashParts[1]}</td>
                    </>
                  ) : (
                    <td colSpan={hasDashSplit ? 2 : undefined}>{row.text}</td>
                  )}
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
