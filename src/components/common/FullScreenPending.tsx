import { Loader2 } from "lucide-react";

export const FullScreenPending = () => {
  return (
    <section className="fixed-centered-content">
      <div className="flex m-auto items-center">
        <Loader2 className="animate-spin mr-2" />
        Loading data...
      </div>
    </section>
  );
};
