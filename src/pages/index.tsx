import { type NextPage } from "next";
import { useAppSelector } from "~/hooks/redux";
import Title from "~/components/Title";
import Puzzle from "~/components/Puzzle";
import Guess from "~/components/Guess";
import Answer from "~/components/Answer";

const Home: NextPage = () => {
  const mode = useAppSelector((state) => state.meta.mode);
  const mounted = useAppSelector((state) => state.meta.mounted);

  return (
    <div className="m-2 mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
      <Title mode={mode} mounted={mounted} />
      <Puzzle mode={mode} mounted={mounted} />
      <Guess mode={mode} mounted={mounted} />
      <Answer mode={mode} mounted={mounted} />
    </div>
  );
};

export default Home;
