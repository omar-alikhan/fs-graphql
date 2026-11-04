const Notification = props => {
  if (props.error) {
    setTimeout(() => props.setError(""), 5000);
  }
  return <div style={{ color: "red" }}>{props.error}</div>;
};

export default Notification;
