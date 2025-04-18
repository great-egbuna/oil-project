import { FaUserSlash } from "react-icons/fa";

export const EmptyUsersCard = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-dashed border-gray-200 text-center">
    <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
      <FaUserSlash className="w-8 h-8 text-blue-400" />
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>

    <p className="text-gray-500 max-w-md">
      It looks like there are no users available in the system yet. Check back
      later
    </p>
  </div>
);
