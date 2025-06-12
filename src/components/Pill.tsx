import { MouseEventHandler } from "react";

interface Props {
  filepath: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function Pill(props: Props) {
  const { filepath, onClick } = props;

  return (
    <div className="fade-in bg-primary px-gap py-1 text-sm rounded-full flex items-center gap-2 hover:brightness-110">
      <span className="pointer-events-none">{filepath.split("/").pop()?.replace(".parquet", "")}</span>
      <button onClick={onClick} className="bg-white rounded-full aspect-square w-3 h-3 text-[8px]">
        x
      </button>
    </div>
  );
}

export default Pill;
