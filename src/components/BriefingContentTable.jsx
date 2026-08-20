// BE contentTables(섹션별로 이미 headers/rows로 구조화된 표 데이터)를 그대로 그림
// BriefingBulletTable(불릿 텍스트를 정규식으로 파싱해서 표 흉내를 내는 방식)과 달리
// 실제 헤더 행(thead)이 있어서 브리핑 상세 CSS의 기본 .briefing-detail-table th 스타일을 그대로 씀
function BriefingContentTable({ table }) {
  if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) return null;
  if (table.headers.length === 0 || table.rows.length === 0) return null;

  return (
    <div className="briefing-detail-table">
      <table>
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <th key={`${header}-${index}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BriefingContentTable;
