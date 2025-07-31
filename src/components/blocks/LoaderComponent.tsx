const LoaderComponent = () => {
  return (
    <div className="h-dvh w-full flex justify-center items-center">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-primary/70 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-primary/90 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
};

export default LoaderComponent;
