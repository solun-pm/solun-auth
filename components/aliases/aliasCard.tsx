import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk, faTrash, faCopy } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AliasCard = ({ userInfo, aliasName, domain, refreshAliases }: any) => {

  const handleDeleteAlias = async (aliasName: string, domain: string) => {
    const fqa = aliasName + domain;
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/delete_alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        fqa: fqa,
      }),
    });
    if (!res.ok) {
      toast.error('Something went wrong');
      return;
    }
    toast.success('Alias deleted successfully');
    refreshAliases();
  }

  const handleCopy = () => {
    toast.success('Alias got copied');
  }

  return (
    <div className="bg-slate-900 rounded p-4 shadow-md flex flex-col justify-between space-y-4 h-full text-center">
      <div>
        <FontAwesomeIcon icon={faMailBulk} className="h-6 w-6" />
        <div className="text-center break-all">
          <h2 className="font-bold text-xl inline-block mr-2">{aliasName}</h2>
          <CopyToClipboard text={aliasName + domain} onCopy={handleCopy}>
            <button className="transition duration-500 ease-in-out transform hover:text-blue-500 text-slate-300">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </CopyToClipboard>
          <p className="text-gray-400">{domain}</p>
        </div>
      </div>
      <button 
        onClick={() => handleDeleteAlias(aliasName, domain)}
        className="text-white bg-red-500 py-2 px-4 rounded font-bold hover:bg-red-600 transition-all self-stretch text-center">
        <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline-block mr-1" /> Delete
      </button>
    </div>
  );
};

export default AliasCard;