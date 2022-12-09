import { Benefit } from '../../lib/types/Event'

interface Props {
  benefits?: Benefit[]
}

const Tag = ({ benefit }: { benefit: Benefit }) => {
  return (
    <div className="bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-xs">
      {benefit.type == 'Others' ? (
        benefit.amount
      ) : (
        <>
          <b>{benefit.amount}</b> {benefit.type}
        </>
      )}
    </div>
  )
}

const BenefitTags = ({ benefits }: Props) => {
  return (
    <>
      {benefits
        ?.sort((a, b) => (a.type.length < b.type.length ? -1 : a.type.length === b.type.length ? 0 : 1))
        .map((b, index) => (
          <Tag key={index} benefit={b} />
        ))}
    </>
  )
}

export default BenefitTags
