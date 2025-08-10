export default function Illo({desc}){
  return (
    <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-2xl p-4 text-center text-xs border border-white/10 bg-white/[.03]">
      Ilustração: {desc}
    </div>
  );
}
