interface Props {
  content: string
}

const Response = ({ content }: Props) => {
  return (
    <div id="aiResponse">
      <div className="response-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default Response

