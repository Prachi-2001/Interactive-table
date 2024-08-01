import { useState } from "react";

// takes users data as a props
const Table = ({ users }) => {
  const [searchValue, setSearchValue] = useState("");
  const [userList] = useState(users);
  const [filteredUsers, setFilteredUsers] = useState(users);
  // limit of rows display per page
  const [rowsLimit] = useState(10);
  const [rowsToShow, setRowsToShow] = useState(users.slice(0, rowsLimit));
  const [totalPage, setTotalPage] = useState(
    Math.ceil(users.length / rowsLimit)
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [sortingColumn, setSortingColumn] = useState({
    column: "country",
    order: "asc",
  });

  // logic for searching keyword
  const searchUsers = (keyword) => {
    keyword = keyword.toLowerCase();
    setSearchValue(keyword);
    let results = userList;

    if (keyword !== "") {
      results = userList.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword) ||
          user.lastName.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.address.city.toLowerCase().includes(keyword) ||
          user.address.country.toLowerCase().includes(keyword)
        );
      });
    }

    // logic for displaying searched results
    setFilteredUsers(results);
    setTotalPage(Math.ceil(results.length / rowsLimit));
    setCurrentPage(0);
    setRowsToShow(results.slice(0, rowsLimit));
  };

  const changePage = (value) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    setRowsToShow(filteredUsers.slice(startIndex, endIndex));
    setCurrentPage(value);
  };

  const clearData = () => {
    setSearchValue("");
    setFilteredUsers(userList);
    setRowsToShow(userList.slice(0, rowsLimit));
    setTotalPage(Math.ceil(userList.length / rowsLimit));
    setCurrentPage(0);
  };

  // logic of sorting on each columns
  // by default active sort on country
  const sortByColumn = (column) => {
    const newOrder = sortingColumn.order === "asc" ? "desc" : "asc";
    const sortedData = [...filteredUsers].sort((a, b) => {
      let aValue, bValue;

      if (column === "city" || column === "country") {
        aValue = a.address[column];
        bValue = b.address[column];
      } else {
        aValue = a[column];
        bValue = b[column];
      }

      if (column === "id") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return newOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setSortingColumn({ column, order: newOrder });
    setFilteredUsers(sortedData);
    setRowsToShow(
      sortedData.slice(currentPage * rowsLimit, (currentPage + 1) * rowsLimit)
    );
  };

  const nextPage = () => {
    if (currentPage < totalPage - 1) {
      const startIndex = rowsLimit * (currentPage + 1);
      const endIndex = startIndex + rowsLimit;
      setRowsToShow(filteredUsers.slice(startIndex, endIndex));
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      const startIndex = (currentPage - 1) * rowsLimit;
      const endIndex = startIndex + rowsLimit;
      setRowsToShow(filteredUsers.slice(startIndex, endIndex));
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen h-full bg-white flex items-center justify-center pt-10 pb-14">
      <div className="w-full max-w-5xl px-2">
        <div className="flex justify-end bg-[#222E3A]/[6%] px-2 mt-2 py-2 border border-b-0 border-black">
          <div className="px-2 bg-white py-3 rounded-lg border-[1px] border-black">
            <div className="flex items-center gap-2 ">
              <input
                type="text"
                className="max-w-[150px] text-sm bg-transparent focus:ring-0 border-transparent outline-none placeholder:text-black text-black w-[85%]"
                placeholder="Keyword Search"
                onChange={(e) => {
                  searchUsers(e.target.value);
                }}
                value={searchValue}
              />
              <svg
                stroke="currentColor"
                fill="black"
                className={`text-black cursor-pointer ${
                  searchValue?.length > 0 ? "visible" : "invisible"
                }`}
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                onClick={clearData}
              >
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border">
            <thead
              className={`rounded-lg text-base text-white font-semibold w-full ${
                rowsToShow?.length > 0 ? "border-b-0" : "border border-black"
              }`}
            >
              <tr className="bg-[#222E3A]/[6%]  border border-black">
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("id")}
                  >
                    ID
                    {sortingColumn.column === "id" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("firstName")}
                  >
                    First Name
                    {sortingColumn.column === "firstName" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("lastName")}
                  >
                    Last Name
                    {sortingColumn.column === "lastName" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("email")}
                  >
                    Email
                    {sortingColumn.column === "email" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("city")}
                  >
                    City
                    {sortingColumn.column === "city" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap cursor-pointer">
                  <button
                    className="w-full text-left"
                    onClick={() => sortByColumn("country")}
                  >
                    Country
                    {sortingColumn.column === "country" && (
                      <span>{sortingColumn.order === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className=" border-black border">
              {rowsToShow?.map((data, index) => (
                <tr
                  className={`${
                    index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                  }`}
                  key={index}
                >
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.id}
                  </td>
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.firstName}
                  </td>
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.lastName}
                  </td>
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.email}
                  </td>
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.address?.city}
                  </td>
                  <td className="py-2 px-3 font-normal text-base whitespace-nowrap">
                    {data?.address?.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={`flex justify-center ${
            totalPage > 1 ? "flex" : "hidden"
          } py-2`}
        >
          <button
            className="w-8 h-8 bg-[#F9FAFB] border border-[#DFE3E8] rounded-md cursor-pointer disabled:bg-[#212B36]/[3%] disabled:text-[#212B36]/[26%]"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
          {Array.from({ length: totalPage }, (_, index) => (
            <button
              className={`w-8 h-8 border border-[#DFE3E8] ${
                index === currentPage
                  ? "bg-[#2065D1] text-white"
                  : "bg-[#F9FAFB] text-black"
              } rounded-md cursor-pointer`}
              key={index}
              onClick={() => changePage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 bg-[#F9FAFB] border border-[#DFE3E8] rounded-md cursor-pointer disabled:bg-[#212B36]/[3%] disabled:text-[#212B36]/[26%]"
            onClick={nextPage}
            disabled={currentPage === totalPage - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
