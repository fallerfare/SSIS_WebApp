export const useGetUsers = ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput) => {
  const {
    data: allUsersData,
    isLoading: isAllUsersDataLoading,
  } = useQuery<UseUsersResponse, AxiosError>({
    queryKey: ["users", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllUsersFn({
        sorting,
        columnFilters,
        pagination,
      }),
  });

  return { allUsersData, isAllUsersDataLoading };
};