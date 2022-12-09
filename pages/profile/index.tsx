import { FaCalendar, FaUser } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import NotFoundPage from "../404";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";
import { eventConverter } from "../../lib/types/Event";
import Card from "../../components/event/card";
import Link from "next/link";
import { BiPencil, BiRightArrow } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";

const EventDetail = () => {
  const router = useRouter();
  const { user, loading: loadAuth } = useAuth();

  const ref = collection(db, "event").withConverter(eventConverter);
  const [data, loading, error] = useCollectionData(
    query(ref, orderBy("startDate", "asc"), limit(3))
  );
  if (loadAuth || loading) {
    return <>Loading</>;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <div className="lg:px-40 px-4 md:px-16 mt-8">
      <Link href={"/"} passHref>
        <div className="flex gap-3 items-center cursor-pointer text-slate-700 hover:text-sky-800">
          <IoMdArrowBack className="text-2xl"/>
          <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
            <b>Home</b>
          </h4>
        </div>
      </Link>
      <div>
        <div className="flex w-full gap-6">
          <div className="basis-2/5">
            <div className="bg-white p-6 drop-shadow-lg rounded-lg">
              <div className="flex items-center justify-between px-2 font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <FaUser className="mr-1" />
                  <span className="tracking-wide">Profile</span>
                </div>
                <Link href={"/profile/edit"} passHref>
                  <BiPencil className="cursor-pointer hover:text-sky-700" />
                </Link>
              </div>
              <div className="text-gray-700">
                <div className="grid grid-cols-2 text-sm mt-6">
                  <div className="px-4 py-2 font-semibold">Name</div>
                  <div className="px-4 py-2">{user?.name}</div>
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">
                    <a className="text-blue-800" href={`mailto:${user?.email}`}>
                      {user?.email}
                    </a>
                  </div>
                  <div className="px-4 py-2 font-semibold">Line ID</div>
                  <div className="px-4 py-2">
                    {user?.lineID != null ? user.lineID : "-"}
                  </div>
                  <div className="px-4 py-2 font-semibold">Phone Number</div>
                  <div className="px-4 py-2">
                    {user?.phoneNumber != null ? user.phoneNumber : "-"}
                  </div>
                  <div className="px-4 py-2 font-semibold">Instagram</div>
                  <div className="px-4 py-2">
                    {user?.instagram != null ? user.instagram : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-50/10 rounded-lg shadow drop-shadow-sm p-6">
            <div className="flex items-center justify-between font-semibold text-gray-800">
              <div className="flex gap-3 items-center">
                <FaCalendar />
                <h4 className="tracking-wid text-base">Your Upcoming Event</h4>
              </div>
              <Link href={"/"} passHref>
                <div className="flex items-center gap-3 text-base cursor-pointer hover:text-sky-700 font-bold">
                  <h5>View All</h5>
                  <BsChevronRight className="stroke-1"/>
                </div>
              </Link>
            </div>
            <div className="grid grid-cols-1 space-y-2 gap-4 mt-6">
              {data?.map((d) => (
                <Card key={d.eventId} event={d} horizontalLayout showSlot={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
