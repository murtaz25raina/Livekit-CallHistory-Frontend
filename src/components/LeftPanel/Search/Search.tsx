import { FC } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./Search.css";

const Search: FC = () => {
  return (
    <div className="left-panel-search-container group">
      <AiOutlineSearch className="left-panel-search-icon" />
      <input
        type="text"
        placeholder="Search Messages or Users"
        className="left-panel-search-input"
      />
    </div>
  );
};

export default Search;
