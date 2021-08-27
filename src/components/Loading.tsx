import classNames from 'classnames';
import Image from 'next/image';
// MUI
import Typography from '@material-ui/core/Typography';

type Props = {
  inline?: boolean;
  noText?: boolean;
  small?: boolean;
  inMiddle?: boolean;
} & typeof defaultProps;

const defaultProps = {
  inline: false,
  noText: false,
  small: false,
  inMiddle: false,
};

const Loading = (props: Props) => {
  const { inline, noText, small, inMiddle } = props;

  return (
    <Typography
      component="div"
      variant="h6"
      gutterBottom
      className={classNames('loader-root', {
        'loader-inline': inline,
        'loader-inMiddle': inMiddle,
        'loader-small': small,
      })}
    >
      <Image
        width="64"
        height="64"
        className={classNames('loader-icon', {
          'loader-noText': !noText,
          'loader-small-icon': small,
        })}
        src={'/main.png'}
      />

      {!noText && 'Loading ...'}
    </Typography>
  );
};

Loading.defaultProps = defaultProps;

export default Loading;
