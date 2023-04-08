import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div className="m-2 mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <img src="testing.webp" className="w-[50%] max-w-lg" />
        <div className="mx-auto w-[100%] max-w-[200px]">
          <ul>
            <li>UWU3</li>
            <li>UWU2</li>
            <li>UWU1</li>
          </ul>
          {/* {answers.map((answer, i) => (
            <div key={i}>
              <p>&nbsp;</p>
              <hr className=" border-black/30 dark:border-white/30" />
            </div>
          ))} */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("UWU");
          }}
          className="flex flex-col items-center"
        >
          <input />
          <div>
            <button>submit</button>
            <button>next</button>
            <button>skip</button>
          </div>
          {/* <TextField onChange={handleChange} label={t("TYPE_HERE")}>
            {input}
          </TextField>
          <div className="flex gap-2">
            <ButtonOutlined type="submit">{t("SUBMIT")}</ButtonOutlined>
            {mode === "unlimited" &&
              (done ? (
                <ButtonOutlined type="button">{t("NEXT")}</ButtonOutlined>
              ) : (
                <ButtonOutlined type="button">{t("SKIP")}</ButtonOutlined>
              ))}
          </div> */}
        </form>
      </div>
    </>
  );
};

export default Home;
