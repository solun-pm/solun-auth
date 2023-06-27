import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk, faTrash } from "@fortawesome/free-solid-svg-icons";

const AliasCard = ({ aliasName, domain }: any) => {
  return (
    <div className="bg-slate-900 rounded p-4 shadow-md flex flex-col justify-between space-y-4 h-full text-center">
      <div>
        <FontAwesomeIcon icon={faMailBulk} className="h-6 w-6" />
        <div className="text-center break-all">
          <h2 className="font-bold text-xl">{aliasName}</h2>
          <p className="text-gray-400">{domain}</p>
        </div>
      </div>
      <button className="text-white bg-red-500 py-2 px-4 rounded font-bold hover:bg-red-600 transition-all self-stretch text-center">
        <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline-block mr-1" /> Delete
      </button>
    </div>
  );
};

export default AliasCard;