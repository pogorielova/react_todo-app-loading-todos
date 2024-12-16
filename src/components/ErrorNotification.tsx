import classNames from 'classnames';

type Props = {
  isError: boolean;
  errorMessage: string;
  onCloseError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  errorMessage,
  onCloseError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {errorMessage}
    </div>
  );
};
