import DivPDFExport from "@/components/export/DivPDFExport";
import PagePDFExport from "@/components/export/PagePDFExport";

export default function ProductFeatureTitle(props) {
  const { feature, product } = props;
  console.log("ProductFeatureTitle | ", { feature, product });


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
          {product && product + " - "}
          {feature}
          {/* <DivPDFExport /> */}
          <PagePDFExport/>
      </h1>
    </>
  );
}
