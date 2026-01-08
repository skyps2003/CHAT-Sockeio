const GenderCheckbox = ({ selectedGender, onCheckboxChange }) => {
	return (
		<div className="flex justify-center gap-4 w-full mt-2">

			{/* OPCIÓN MASCULINO */}
			<label className="cursor-pointer flex-1 relative">
				<input
					type="radio"
					name="gender"
					className="peer sr-only"
					checked={selectedGender === "masculino"}
					onChange={() => onCheckboxChange("masculino")}
				/>
				<div className="
                    w-full flex items-center justify-center 
                    py-3 px-4 rounded-xl border border-green-500/30 
                    bg-[#020617]/40 text-gray-400 font-semibold
                    transition-all duration-200
                    
                    hover:border-green-500/60 hover:bg-green-500/5 hover:text-green-300
                    
                    /* ESTILOS ACTIVOS (CHECKED) */
                    peer-checked:bg-green-500/10 
                    peer-checked:border-green-500 
                    peer-checked:text-green-400
                    peer-checked:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                    peer-checked:scale-[1.02]
                ">
					Masculino
				</div>
			</label>

			{/* OPCIÓN FEMENINO */}
			<label className="cursor-pointer flex-1 relative">
				<input
					type="radio"
					name="gender"
					className="peer sr-only"
					checked={selectedGender === "femenino"}
					onChange={() => onCheckboxChange("femenino")}
				/>
				<div className="
                    w-full flex items-center justify-center 
                    py-3 px-4 rounded-xl border border-green-500/30 
                    bg-[#020617]/40 text-gray-400 font-semibold
                    transition-all duration-200
                    
                    hover:border-green-500/60 hover:bg-green-500/5 hover:text-green-300
                    
                    /* ESTILOS ACTIVOS (CHECKED) */
                    peer-checked:bg-green-500/10 
                    peer-checked:border-green-500 
                    peer-checked:text-green-400
                    peer-checked:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                    peer-checked:scale-[1.02]
                ">
					Femenino
				</div>
			</label>

		</div>
	);
};

export default GenderCheckbox;