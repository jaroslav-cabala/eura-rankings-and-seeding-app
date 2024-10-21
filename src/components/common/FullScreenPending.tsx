import { Loader2 } from "lucide-react";

export const FullScreenPending = () => {
  return (
    <section className="fixed-centered-content flex justify-center m-auto">
      <Loader2 className="animate-spin mr-2" />
      Loading data...
    </section>
  );
};
