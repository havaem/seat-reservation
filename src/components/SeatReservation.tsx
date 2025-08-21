import BookAction from "./BookAction";
import PageTitle from "./ui/title";

const SeatReservation = () => {
  return (
    <section id="dat-ve">
      <div className="flex min-h-[800px] flex-col justify-center gap-8 px-4 py-10">
        <PageTitle className="text-center text-white">Đặt Vé</PageTitle>
        <div className="mb-6 w-full">
          <BookAction />
        </div>
      </div>
    </section>
  );
};
export default SeatReservation;
