import CardProgress from "../../components/dashboard/CardProgress";
import CardRingProgress from "../../components/dashboard/CardRingProgress";

const progressData = [
  {
    label: "Page views",
    stats: "456,578",
    progress: 65,
    color: "teal",
    icon: "c",
  },
  {
    label: "New users",
    stats: "2,550",
    progress: 72,
    color: "blue",
    icon: "c",
  },
  {
    label: "Orders",
    stats: "4,735",
    progress: 52,
    color: "red",
    icon: "c",
  },
];

const IndexPage = (): JSX.Element => {
  return (
    <div className="mx-auto mt-2 flex max-w-7xl flex-col gap-y-6 px-4 sm:px-6 lg:px-8">
      <CardProgress />
      <CardRingProgress data={progressData} />
    </div>
  );
};

export default IndexPage;
