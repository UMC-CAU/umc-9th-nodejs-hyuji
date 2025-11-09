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
  if (!user) return null;

  return {
    id: user.user_id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birthday: user.birthday
      ? new Date(user.birthday).toISOString().split("T")[0]
      : null,
    address: user.address || "",
    phone: user.phone || "",
    areaId: user.area_id || null,
    preferences: Array.isArray(preferences)
      ? preferences
      : user.preferences || [],
    createdAt: user.created_at
      ? new Date(user.created_at).toISOString()
      : undefined,
    updatedAt: user.updated_at
      ? new Date(user.updated_at).toISOString()
      : undefined,
  };
};
