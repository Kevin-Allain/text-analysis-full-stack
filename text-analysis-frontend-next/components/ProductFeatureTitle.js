import DivPDFExport from "@/components/export/DivPDFExport";
import PagePDFExport from "@/components/export/PagePDFExport";

export default function ProductFeatureTitle(props) {
  const { feature, product } = props;
  console.log("ProductFeatureTitle | ", { feature, product });
  return (
    <>
      <h1 style={{"box-shadow": "5px 5px","padding-left": "5px",margin: "10px",border: "solid", "display":"flex", "justify-content":"space-evenly"}}>
          {product && product + " - "}
          {feature}
          {/* <DivPDFExport /> */}
          <PagePDFExport/>
      </h1>
    </>
  );
}
