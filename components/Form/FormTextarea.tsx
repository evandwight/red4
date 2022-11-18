export default function FormTextarea({ id, label, cols, rows, passThroughProps }:
    { id: string, label: string, cols: number, rows: number, passThroughProps?: any }) {
    return <tr>
        <th className="flex items-start"><label htmlFor={id}>{label}:</label></th>
        <td><textarea className="w-full h-64 text-black" type="text" name={id} id={id} {... { cols, rows, ...passThroughProps }} /></td>
    </tr>

}