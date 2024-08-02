export default function ModularTitle(props) {
  const { title } = props;
  console.log("ModularTitle | ", { title });
  return (
    <>
      <h1 style={{
          "boxShadow": "5px 5px",
          "paddingLeft": "5px",
          margin: "10px",
          border: "solid", 
          "display":"flex", 
          "justifyContent":"space-evenly",
          }}
          >
          {title}
      </h1>
    </>
  );
}
