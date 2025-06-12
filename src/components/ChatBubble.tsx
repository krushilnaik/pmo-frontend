import { Message } from "@/types";

export default function ChatBubble(props: Message) {
  const { sender } = props;

  return props?.attachments ? (
    <div className="flex gap-0.5 ml-16">
      <button className="rounded-r-none p-3">
        <a href={props.attachments}>Download Excel</a>
      </button>
      <button className="rounded-l-none">x</button>
    </div>
  ) : (
    <div className="flex gap-2" style={{ flexDirection: sender == "bot" ? "row" : "row-reverse" }}>
      <div className="bg-sky-800 rounded-full w-14 h-14 grid place-content-center">{sender}</div>
      <div className="bg-gray-700 w-3/5 p-4 rounded-lg">
        {props?.image && <img src={props.image} width={500} alt="chart" />}
        {props?.message && props.message}
      </div>
    </div>
  );
}
