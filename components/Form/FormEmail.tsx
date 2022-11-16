export default function FormEmail({ id, label, passThroughProps }) {
    return <tr>
        <th><label htmlFor={id}>{label}:</label></th>
        <td><input className="w-64 text-black" type="email" name={id} id={id} {... passThroughProps}/></td>
    </tr>
}