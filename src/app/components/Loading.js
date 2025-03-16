export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src="/images/pokeball.png"
        alt="Chargement..."
        className="animate-spin w-16 h-16"
      />
    </div>
  );
}
