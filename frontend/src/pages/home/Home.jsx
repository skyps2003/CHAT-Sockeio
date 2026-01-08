import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-[#020617]/80 backdrop-blur-xl bg-opacity-0'>
			<Sidebar />
			<MessageContainer />

		</div>
	);
};
export default Home;