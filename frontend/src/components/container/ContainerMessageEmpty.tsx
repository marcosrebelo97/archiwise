import Typography from '@mui/material/Typography'

interface Props {
  message: string
  urlIllustration?: string
}

export function ContainerMessageEmpty({ message, urlIllustration }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full px-4 text-center">
      {urlIllustration && (
        <img
          src={urlIllustration}
          alt="Ilustração"
          className="w-2/3 max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[600px] object-contain"
        />
      )}
      <Typography variant="h5" className="max-w-[90%] sm:max-w-[70%] md:max-w-[60%]">
        {message}
      </Typography>
    </div>
  );
}
