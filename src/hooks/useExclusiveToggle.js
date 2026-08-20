// 다중 선택 목록에서 특정 항목들(exclusiveItems)이 선택되면 다른 선택을 모두 해제하고,
// 반대로 일반 항목이 선택되면 exclusiveItems 선택을 해제하는 토글 로직을 공용화한 훅입니다.
// Onboarding10(온보딩 지원 여부)과 MyInfoEdit(내 정보 수정)에서 동일한 규칙으로 사용됩니다.
function useExclusiveToggle(list, setList, exclusiveItems) {
  return (item) => {
    if (list.includes(item)) {
      setList(list.filter((value) => value !== item));
      return;
    }
    if (exclusiveItems.includes(item)) {
      setList([item]);
    } else {
      setList([...list.filter((value) => !exclusiveItems.includes(value)), item]);
    }
  };
}

export default useExclusiveToggle;
