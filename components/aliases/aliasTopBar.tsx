import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const AliasesTopBar = ({ aliasCount }: any) => {
  return (
    <div className="flex items-center my-4">
      <div className="px-4 py-2 bg-blue-500 text-white rounded">
      <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
      {aliasCount === 1 ? <span><span className="font-semibold">1</span> Alias</span> : <span><span className="font-semibold">{aliasCount}</span> Aliases</span>}
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded flex hover:bg-blue-600 transition-all items-center ml-4">
        <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add new
      </button>
    </div>
  );
};

export default AliasesTopBar;