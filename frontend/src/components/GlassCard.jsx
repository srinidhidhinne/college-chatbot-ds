export default function GlassCard({title,value,subtitle}){

  return(
    <div className="glass card glass-hover">

      <h4 style={{opacity:0.8}}>{title}</h4>

      <h1 style={{marginTop:"10px"}}>
        {value}
      </h1>

      <p style={{opacity:0.6,marginTop:"8px"}}>
        {subtitle}
      </p>

    </div>
  )
}