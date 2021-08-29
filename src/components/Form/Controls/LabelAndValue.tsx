import Typography from '@material-ui/core/Typography';

type Props = {
  label: string;
  value: any;
};

const LabelAndValue = (props: Props) => {
  const { label, value } = props;

  return (
    <div className={'labelAndValue'}>
      <Typography gutterBottom className={'labelAndValueLabel'}>
        {label}
      </Typography>

      <Typography className={'valueSize'}>{value || '...'}</Typography>
    </div>
  );
};

export { LabelAndValue };
