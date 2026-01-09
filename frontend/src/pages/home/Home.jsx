import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();

	return (
		<div className='flex h-full md:h-[550px] rounded-lg overflow-hidden bg-[#020617]/80 backdrop-blur-xl bg-opacity-0 w-full'>
			<div className={`${selectedConversation ? "hidden" : "block"} md:block w-full md:w-auto h-full`}>
				<Sidebar />
			</div>
			<div className={`${!selectedConversation ? "hidden" : "flex"} md:flex flex-1 w-full md:w-auto h-full`}>
				<MessageContainer />
			</div>

		</div>
	);
};
export default Home;