type PdfProp= {
    pdfUrl: string;
}
const PdfPreview = ({ pdfUrl }:PdfProp) => {
  return (
    <div>
        <iframe src={pdfUrl} title="PDF Viewer" style={{ width: '600px', height: '500px', border: '0' }}></iframe>
    </div>
  )
}

export default PdfPreview
