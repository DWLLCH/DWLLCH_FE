import { parseBulletRows } from '../constants/briefing';

// content의 "• [라벨]: 설명" 불릿 본문을 표로 그림, thead 없이 tbody만 구성함
// 라벨이 하나라도 있으면 2열(라벨 | 설명), 라벨이 하나도 없으면 1열(설명만) 표로 그림
function BriefingBulletTable({ body }) {
  const rows = parseBulletRows(body);
  if (rows.length === 0) return null;

  const hasLabel = rows.some((row) => row.label);

  return (
    <div className="briefing-detail-table briefing-detail-table--bullets">
      <table>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${row.label}`}>
              {hasLabel && <td className="briefing-detail-table-label">{row.label}</td>}
              <td>{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BriefingBulletTable;
