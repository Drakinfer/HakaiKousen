export default function Loading(heightClass) {
  return (
    <div className="flex justify-center items-center h-main">
      <img
        src="/images/pokeball.png"
        alt="Chargement..."
        className="animate-spin w-16 h-16"
      />
    </div>
  );
}
