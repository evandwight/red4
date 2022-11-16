export default function FormUrl({ id, label, passThroughProps }:
    { id: string, label: string, passThroughProps?: any }) {
    return <tr>
        <th><label htmlFor={id}>{label}:</label></th>
        <td><input className="w-64 text-black" type="url" name={id} id={id} maxLength={2000} {...passThroughProps} /></td>
    </tr>
}