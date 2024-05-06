type PdfProp= {
    pdfUrl: string;
}
const PdfPreviewComponent = ({ pdfUrl }:PdfProp) => {
  return (
    <div>
        <iframe src={pdfUrl} title="PDF Viewer" style={{ width: '600px', height: '500px', border: '0' }}></iframe>
    </div>
  )
}

export default PdfPreviewComponent
