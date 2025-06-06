import Charts from "../components/Dashboard/Chart";
import Aside from "../components/Aside";

const Home = () => {
  return (
    <div id="main-wrapper" className=" flex">
      <Aside />
      <div className=" w-full page-wrapper overflow-hidden">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center text-2xl font-bold mb-4">Dashboard</h1>
            </div>
          </div>
          <div className="row">
            <div className="">
              <Charts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
