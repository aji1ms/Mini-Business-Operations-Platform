const Header = ({ title, description }) => {
    return (
        <header className="bg-white py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
                <div className="px-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {description}
                    </p>
                </div>
            </div>
        </header>
    )
}

export default Header
