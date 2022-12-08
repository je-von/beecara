import Image from "next/image";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { Event } from "../../lib/types/Event";
import { organizationConverter } from "../../lib/types/Organization";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuth } from "../../lib/authContext";
import { collection, limit, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig/init";
import { userConverter } from "../../lib/types/User";
import Skeleton from "react-loading-skeleton";

interface Props {
  event: Event;
  showRegisterStatus?: Boolean;
  showImage?: Boolean;
  showTitle?: Boolean;
  showDate?: Boolean;
  showSlot?: Boolean;
  showOrganizer?: Boolean;
  showBenefits?: Boolean;
}

export const SkeletonCard = () => (
  <div
    className={`p-5 h-full w-full rounded-lg shadow-lg bg-white flex flex-col justify-between`}
  >
    <div className="flex flex-col gap-5">
      <Skeleton height={120} width={"100%"} />
      <Skeleton count={3} width={"100%"} height={25} />
    </div>
    <Skeleton count={2} width={"100%"} height={25} />
  </div>
);

const Card = ({
  event,
  showRegisterStatus,
  showImage,
  showTitle,
  showDate,
  showSlot,
  showOrganizer,
  showBenefits,
}: Props) => {
  const { user: userAuth, loading: loadingAuth } = useAuth();
  const organizationRef = event.organization.withConverter(
    organizationConverter
  );
  const userRef = collection(db, "user").withConverter(userConverter);
  const [user, loadingUser, errorUser] = useCollectionData(
    query(userRef, where("email", "==", `${userAuth?.email}`), limit(1))
  );
  const [organization, loadingOrganization, errorOrganization] =
    useDocumentData(organizationRef);

  if (loadingAuth || loadingUser || loadingOrganization)
    return <SkeletonCard />;
  const isRegistered =
    user &&
    user.length > 0 &&
    event &&
    event.users &&
    event.users.length > 0 &&
    event.users.some((u) => u.id === user[0].userId);
  return (
    <Link href={`event/${event.eventId}`} key={event.eventId} passHref>
      <div
        className={`cursor-pointer transition-all duration-[400ms] overflow-hidden rounded-lg shadow-lg hover:ring-2 hover:ring-sky-300 bg-white  flex justify-between gap-5 items-start relative p-5 flex-col`}
      >
        {showRegisterStatus && isRegistered && (
          <div className="absolute top-0 left-0 z-10 text-sm font-bold text-white bg-sky-400 px-4 py-2 rounded-br-xl">
            Registered
          </div>
        )}
        {showImage && (
          <div className="w-full h-40 relative rounded">
            <Image
              className="relative rounded"
              objectFit="cover"
              src={event.image}
              alt={event.name}
              sizes="100%"
              layout="fill"
            ></Image>
          </div>
        )}
        <div className="flex items-start md:basis-5/6">
          <div className="flex flex-col gap-1 h-full justify-between">
            <div className="flex flex-col gap-1">
              {showTitle && (
                <h4 className="font-secondary text-xl mb-1 gap-2 flex flex-col ">
                  {event.name}
                </h4>
              )}
              <div className="flex flex-col md:gap-6 lg:gap-1">
                {showDate && (
                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-gray-400" />
                    {event.startDate?.toDate().toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}

                {showSlot && (
                  <div className="flex items-center gap-1">
                    <BsPeopleFill className="text-gray-400" />
                    {event.users?.length} / {event.capacity}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {showBenefits && (
                <div className="flex items-start flex-wrap gap-2 mt-2">
                  {event.benefit
                    ?.sort((a, b) => {
                      return a.type.length < b.type.length
                        ? -1
                        : a.type.length === b.type.length
                        ? 0
                        : 1;
                    })
                    .map((b, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-xs"
                      >
                        {b.type == "Others" ? (
                          b.amount
                        ) : (
                          <>
                            <b>{b.amount}</b> {b.type}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
              {showOrganizer && (
                <div className="flex justify-start">
                  <h5 className="text-sm font-bold">{ organization?.name }</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
