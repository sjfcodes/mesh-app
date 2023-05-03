import './style.scss';

interface Props {
  text: string;
}

export default function SectionHeader({ text }: Props) {
  return <h4 className="ma-section-header">{text}</h4>;
}
