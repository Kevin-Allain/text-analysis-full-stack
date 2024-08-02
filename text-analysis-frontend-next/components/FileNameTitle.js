export default function FileNameTitle(props) {
  const { fileName } = props;
  console.log("FileNameTitle | ", { fileName });
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
          File Name:{" "}{fileName}
      </h1>
    </>
  );
}
