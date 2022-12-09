import { FaCalendar, FaUser } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import NotFoundPage from "../404";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, limit, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";
import { eventConverter, eventRegisteredUsersConverter } from "../../lib/types/Event";
import Card from "../../components/event/card";
import Link from "next/link";
import { BiPencil, BiRightArrow } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";
import { useMemo } from "react";

const EventDetail = () => {
  const router = useRouter();
  const { user, loading: loadAuth } = useAuth();

  const ref = collection(db, "event").withConverter(eventConverter);
  const today = useMemo(() => Timestamp.now(), [])
  const [data, loading, error] = useCollectionData(
    query(ref, where("startDate", ">", today), orderBy("startDate", "asc"), limit(3))
  );
  if (loadAuth || loading) {
    return <>Loading</>;
  }


  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <div className="lg:px-40 px-4 md:px-16 mt-8">
      <Link href={"/profile"} passHref>
        <div className="flex gap-3 items-center cursor-pointer text-slate-700 hover:text-sky-800">
          <IoMdArrowBack className="text-2xl"/>
          <h4 className="font-secondary text-2xl mb-1 gap-2 flex md:flex-row flex-col ">
            <b>Profile</b>
          </h4>
        </div>
      </Link>
      <div>
        <div className="flex w-full gap-6">
          <div className="flex-1 bg-slate-50/10 rounded-lg shadow drop-shadow-sm p-6">
            <div className="flex items-center justify-between font-semibold text-gray-800">
              <div className="flex gap-3 items-center">
                <FaCalendar />
                <h4 className="tracking-wid text-base">Your Upcoming Event</h4>
              </div>
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
