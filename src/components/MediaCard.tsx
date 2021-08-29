import React, { useMemo, ReactNode } from 'react';
//MUI
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const ACTION_POSITION = {
  right: 'flex-start',
  left: 'flex-end',
  center: 'center',
};

type Props = {
  actionsStyles?: Record<string, unknown>;
  cardContentStyles?: Record<string, unknown>;
  bodyHeaderStyles?: Record<string, unknown>;
  avatarStyles?: Record<string, unknown>;

  actions?: any[];

  avatarSrc?: string;
  cardHeaderTitle?: string;
  cardHeaderSubtitle?: string;

  actionsPosition?: 'right' | 'left' | 'center';
  avatarShape?: 'circle' | 'rounded' | 'square';

  bodyHeader?: any;
  bodyContent?: any;
  cardHeaderAction?: ReactNode;

  disableActionsSpacing?: boolean;
} & typeof defaultProps;

const defaultProps = {
  cardHeaderTitle: '',
  cardHeaderSubtitle: '',
  actionsPosition: 'right',
  avatarShape: 'circle',
  avatarSrc: '',

  disableActionsSpacing: false,

  actionsStyles: {},
  avatarStyles: {},
  cardContentStyles: {},
};

const CardMediaPreviewer = (props: Props) => {
  const {
    bodyHeader,
    bodyContent,
    actions,
    cardHeaderTitle,
    cardHeaderSubtitle,
    cardHeaderAction,
    disableActionsSpacing,
    actionsStyles,
    cardContentStyles,
    bodyHeaderStyles,
    avatarStyles,
    actionsPosition,
    avatarShape,
    avatarSrc,
  } = props;

  const cardHeaderProps = useMemo(() => {
    const props = {};

    if (avatarSrc) {
      props.avatar = (
        <Avatar
          variant={avatarShape}
          aria-label={'avatar'}
          style={avatarStyles}
          src={avatarSrc}
        />
      );
    }

    if (cardHeaderAction) {
      props.action = (
        <IconButton aria-label="settings">{cardHeaderAction}</IconButton>
      );
    }

    return props;
  }, [avatarSrc, cardHeaderAction]);

  return (
    <Card className={'card'}>
      {cardHeaderTitle && (
        <CardHeader
          title={cardHeaderTitle}
          subheader={cardHeaderSubtitle}
          {...cardHeaderProps}
        />
      )}

      {(bodyHeader || bodyContent) && (
        <CardContent style={cardContentStyles} className={'cardContent'}>
          {bodyHeader && (
            <Typography gutterBottom variant={'h5'} style={bodyHeaderStyles}>
              {bodyHeader}
            </Typography>
          )}

          {bodyContent}
        </CardContent>
      )}

      {actions && (
        <CardActions
          disableSpacing={disableActionsSpacing}
          style={{
            ...actionsStyles,
            justifyContent: ACTION_POSITION[actionsPosition],
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

CardMediaPreviewer.defaultProps = defaultProps;

export default CardMediaPreviewer;
