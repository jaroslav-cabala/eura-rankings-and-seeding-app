import { Frown } from "lucide-react";

export const FullScreenError = () => {
  return (
    <section>
      <div className="fixed-centered-content flex justify-center m-auto">
        <Frown className="mr-2" />
        Unexpected error.
      </div>
    </section>
  );
};
