import { useState } from "react";
import "./App.css";
import Table from "./components/Table";
import { useFetchUsersQuery } from "./store/userApiSlice";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";

function App() {
  const { data: userss, isLoading, isError } = useFetchUsersQuery();

  return (
    <>
      <div>
        <Navbar />
      </div>
      {isLoading ? (
        <>
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        </>
      ) : (
        <Table users={userss.users} />
      )}
    </>
  );
}

export default App;
