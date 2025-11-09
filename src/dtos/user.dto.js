export const bodyToUser = (body) => {
  const birthday = new Date(body.birthday); 

  return {
    email: body.email,           
    password: body.password,     
    name: body.name,            
    gender: body.gender,         
    birthday,                    
    address: body.address || "", 
    phone: body.phone,           
    areaId: body.areaId || null, 
    preferences: body.preferences || [], 
  };
};

export const responseFromUser = ({ user, preferences } = {}) => {
  const preferFoods = Array.isArray(preferences)
    ? preferences
        .map((p) => p?.foodCategory?.name ?? p?.food_type_name ?? null)
        .filter(Boolean)
    : [];

  return {
    email: user?.email ?? null, 
    name: user?.name ?? null,   
    preferCategory: preferFoods,
  };
};
